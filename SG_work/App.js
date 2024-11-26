import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import KoreaMap from './components/KoreaMap';
import MapView from './components/MapView';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 초기 화면: KoreaMap */}
        <Route path="/" element={<KoreaMap />} />
        {/* 지도 화면: MapView */}
        <Route path="/map" element={<MapView />} />
      </Routes>
    </Router>
  );
}

export default App;