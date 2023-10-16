import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import Waitlist from "./waitlist.js";
import { collection, getDocs } from "firebase/firestore";
import apart1 from "../../assets/apart_1.png";
import { Link } from "react-router-dom";
import AddressBlock from "./AddressBlock.js";
import Map from "./Map.js";
import "./MapPage.css";
import { app, firestore } from "../../firebase.js";
import "leaflet/dist/leaflet.css";
import Header from "../Header.jsx";

const MapPage = () => {
    // const handleWaitlistClick = () => {
    //     // window.location.href = "/Waitlist";
    const markers = [
        //{ lat: 51.505, lng: -0.09, popupContent: "Marker 1" },
        // Add more markers as needed
    ];

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        // Fetch data from Firestore and set it in the state
        const fetchProperties = async () => {
            const propertiesRef = collection(firestore, "apartments");
            const snapshot = await getDocs(propertiesRef);
            const propertyData = snapshot.docs.map((doc) => doc.data());
            setProperties(propertyData);
        };

        fetchProperties();
    }, []);

    return (
        <div className="homepage-boxtop">
            <Header />

            <div className="tab">
                <div className="tab-content">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search..."
                            //onChange={onSearch}
                        />
                        <button>Button 1</button>
                        <button>Button 2</button>
                    </div>
                </div>
            </div>

            <div className="map-page">
                <div className="map-container">
                    <Map markers={markers} />
                </div>
                <div className="address-list">
                    {properties.map((property, index) => (
                        <AddressBlock
                            key={index}
                            address={property.Address}
                            bedrooms={property.Bedrooms}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapPage;
