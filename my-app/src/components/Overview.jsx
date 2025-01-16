import React from "react";
import { useQuery, gql } from "@apollo/client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "./assets/marker.png"; 
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const GET_STATS = gql`
  query GetStats {
    getVillages {
      id
      name
      landArea
      populationSize
      categories
      latitude
      longitude
      genderRatio {
        male
        female
      }
      populationDistribution {
        ageRange
        percentage
      }
    }
  }
`;

const COLORS = ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"];

const Overview = () => {
  const { data, loading, error } = useQuery(GET_STATS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const villages = data.getVillages;

  // Total and aggregated data
  const totalVillages = villages.length;
  const urbanAreas = villages.filter(
    (village) =>
      Array.isArray(village.categories) && village.categories.includes("Urban")
  );
  const totalUrbanAreas = urbanAreas.length;
  const totalPopulation = villages.reduce(
    (sum, village) => sum + village.populationSize,
    0
  );
  const averageLandArea =
    villages.reduce((sum, village) => sum + village.landArea, 0) / totalVillages;

 
  const ageRangeMapping = {
    children: "0-18",
    adults: "18-60",
    seniors: "60+",
  };

  
  const aggregatedAgeDistribution = [
    { ageRange: "0-18", totalPercentage: 0 },
    { ageRange: "18-60", totalPercentage: 0 },
    { ageRange: "60+", totalPercentage: 0 },
  ];

  
  villages.forEach((village) => {
    village.populationDistribution.forEach((distribution) => {
      
      const normalizedAgeRange = ageRangeMapping[distribution.ageRange] || distribution.ageRange;
      
      
      const rangeIndex = aggregatedAgeDistribution.findIndex(
        (item) => item.ageRange === normalizedAgeRange
      );
      if (rangeIndex !== -1) {
        const percentageValue = parseFloat(
          distribution.percentage.replace("%", "").trim()
        );
        aggregatedAgeDistribution[rangeIndex].totalPercentage += percentageValue;
      }
    });
  });

  
  aggregatedAgeDistribution.forEach(
    (item) => (item.averagePercentage = (
      item.totalPercentage / totalVillages
    ).toFixed(2))
  );

  const ageDistributionData = aggregatedAgeDistribution.map((item) => ({
    ageRange: item.ageRange, 
    percentage: parseFloat(item.averagePercentage), 
  }));

  console.log("Aggregated Age Distribution:", ageDistributionData);

  // Gender ratios
  const genderRatios = villages[0]?.genderRatio
    ? [
        { name: "male", value: villages[0].genderRatio.male },
        { name: "female", value: villages[0].genderRatio.female },
      ]
    : [];


  const populationData = villages.map((village) => ({
    name: village.name,
    population: village.populationSize,
  }));

 
  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });

  return (
<div className="flex flex-col w-full min-h-screen bg-gray-900 text-white">
<div className="p-5">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div>

      <div className="flex flex-col w-full h-full bg-gray-900 text-white">
        {/* Map Section */}
        <div className="flex justify-center items-center w-full h-96 px-5">
          <div className="w-full h-full border border-gray-700 rounded-lg overflow-hidden">
            <MapContainer
              center={[31.5, 34.8]}
              zoom={8}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {villages.map((village) => (
                <Marker
                  key={village.id}
                  position={[village.latitude, village.longitude]}
                  icon={customIcon} 
                >
                  <Popup>{village.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 p-5">
        <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold">Total Villages</h2>
          <p className="text-2xl font-bold">{totalVillages}</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold">Urban Areas</h2>
          <p className="text-2xl font-bold">{totalUrbanAreas}</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold">Total Population</h2>
          <p className="text-2xl font-bold">{totalPopulation}</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold">Average Land Area</h2>
          <p className="text-2xl font-bold">{averageLandArea.toFixed(2)} sq km</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 p-5">
        {/* Age Distribution */}
        <div className="bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-center">Age Distribution</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={ageDistributionData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="percentage"
              label={(entry) => `${entry.ageRange}: ${entry.percentage}%`}  
            >
              {ageDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
            <Legend wrapperStyle={{ color: "white" }} />
          </PieChart>
        </div>

        {/* Gender Ratios */}
        <div className="bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-center">Gender Ratios</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={genderRatios}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {genderRatios.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
            <Legend wrapperStyle={{ color: "white" }} />
          </PieChart>
        </div>
      </div>

      {/* Population Size Bar Chart */}
      <div className="p-5">
        <div className="bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-center">Population Size</h2>
          <BarChart width={600} height={300} data={populationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
            <Bar dataKey="population" fill="#36A2EB" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Overview;
