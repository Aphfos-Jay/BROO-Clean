import torch
import torch.nn.functional as F
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.neighbors import kneighbors_graph

# 데이터 로드
file_path = 'tidal_current_data.csv'
data = pd.read_csv(file_path)

# 결측치 확인
print("결측치 개수:\n", data.isnull().sum())

# 결측치 처리
data['current_speed'].fillna(data['current_speed'].mean(), inplace=True)  # 평균값 대체
data['current_dir'].fillna(method='ffill', inplace=True)  # 이전 값으로 채움
data['pre_lat'].fillna(data['pre_lat'].mean(), inplace=True)
data['pre_lon'].fillna(data['pre_lon'].mean(), inplace=True)

# 노드 특성과 엣지 생성
coords = data[['pre_lat', 'pre_lon']].to_numpy()
features = data[['current_dir', 'current_speed', 'pre_lat', 'pre_lon']].to_numpy()

# 정규화
scaler = MinMaxScaler()
node_features = torch.tensor(scaler.fit_transform(features), dtype=torch.float)

# Edge 연결 (k-Nearest Neighbors)
n_neighbors = 5
adj_matrix = kneighbors_graph(coords, n_neighbors, mode='connectivity', include_self=True)
edge_index = torch.tensor(np.array(adj_matrix.nonzero()), dtype=torch.long)

# 레이블 (유속 예측)
labels = torch.tensor(data['current_speed'].values, dtype=torch.float)

# 그래프 데이터 정의
graph_data = Data(x=node_features, edge_index=edge_index, y=labels)

# GCN 모델 정의
class GCN(torch.nn.Module):
    def __init__(self, in_channels, hidden_channels, out_channels):
        super(GCN, self).__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, out_channels)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.conv2(x, edge_index)
        return x

# 학습 및 테스트 데이터 분리
num_nodes = len(labels)
train_mask = torch.randperm(num_nodes)[:int(0.8 * num_nodes)]
test_mask = torch.randperm(num_nodes)[int(0.8 * num_nodes):]

# 모델 초기화
model = GCN(in_channels=node_features.shape[1], hidden_channels=16, out_channels=2)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
criterion = torch.nn.MSELoss()

# 학습 루프
model.train()
for epoch in range(100):
    optimizer.zero_grad()
    out = model(graph_data.x, graph_data.edge_index).squeeze()
    loss = criterion(out[train_mask], labels[train_mask])
    loss.backward()
    optimizer.step()

    if epoch % 10 == 0:
        print(f"Epoch {epoch}, Loss: {loss.item()}")

# 테스트
model.eval()
with torch.no_grad():
    test_pred = model(graph_data.x, graph_data.edge_index).squeeze()
    test_loss = criterion(test_pred[test_mask], labels[test_mask])
    print(f"Test Loss: {test_loss.item()}")
