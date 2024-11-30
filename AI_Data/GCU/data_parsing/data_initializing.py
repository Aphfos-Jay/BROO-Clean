import pandas as pd
import matplotlib.pyplot as plt
import numpy as np


STATIONS = [
    "HF_0064", "HF_0076", "HF_0041",
    "HF_0073", "HF_0075", "HF_0074",
    "HF_0040", "HF_0065", "HF_0039",
    "HF_0063", "HF_0069", "HF_0070",
    "HF_0071"
]



for i, HF in enumerate(STATIONS):
    file_path = '%s.csv'%(HF)
    globals()['df_%d'%(i)] = pd.read_csv(file_path)


tidal_data = pd.concat([df_0, df_1, df_2, df_3, df_4, df_5, df_6, df_7, df_8, df_9, df_10, df_11, df_12])
print(tidal_data)

# file_path = 'HF_0039.csv'

# tidal_data_1 = pd.read_csv(file_path)
# tidal_data_2 = pd.read_csv('HF_0040.csv')
# tidal_data = pd.concat([tidal_data_1, tidal_data_2])

# file_path = 'HF_0039.csv'
# tidal_data = pd.read_csv(file_path)


# Recalculate dx, dy for vector visualization (as before)
tidal_data['dx'] = tidal_data['current_speed'] * np.cos(np.radians(tidal_data['current_direct']))
tidal_data['dy'] = tidal_data['current_speed'] * np.sin(np.radians(tidal_data['current_direct']))

# Plotting without the world map context
fig, ax = plt.subplots(figsize=(10, 10))

# Plot the tidal currents as quivers
ax.quiver(tidal_data['lon'], tidal_data['lat'], tidal_data['dx'], tidal_data['dy'],
          angles='xy', scale_units='xy', scale=500, color='blue', alpha=0.7)

# Set plot limits to the region of interest (based on min and max lat/lon in the data)
ax.set_xlim(tidal_data['lon'].min() - 0.5, tidal_data['lon'].max() + 0.5)
ax.set_ylim(tidal_data['lat'].min() - 0.5, tidal_data['lat'].max() + 0.5)

# Add labels and title
ax.set_title("Tidal Current Directions and Speeds")
ax.set_xlabel("Longitude")
ax.set_ylabel("Latitude")

plt.show()