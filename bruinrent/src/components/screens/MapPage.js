import React, { useState, useEffect } from "react";
import "./MapPage.css"; // Import a separate CSS file for component-specific styles

import { collection, getDocs } from "firebase/firestore";
import AddressBlock from "./AddressBlock.js";
import { firestore } from "../../firebase.js";
import "leaflet/dist/leaflet.css";
import GoogleMap from "../GoogleMap.js";
import Header from "../Header.jsx";

const MapPage = () => {
  const [listings, setListings] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [visibleListings, setVisibleListings] = useState(10); // Display the first 10 listings

  const loadMoreListings = () => {
    // Increase the number of visible listings by 10
    setVisibleListings((prevVisibleListings) => prevVisibleListings + 10);
  };

  useEffect(() => {
    // Fetch data from the "listings" collection in Firestore
    const fetchListings = async () => {
      const listingsRef = collection(firestore, "listings");
      const snapshot = await getDocs(listingsRef);
      const listingsData = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID as 'id'
        ...doc.data(), // Include other data from the document
      }));
      setListings(listingsData);
    };

    fetchListings();
  }, []);

  useEffect(() => {
    console.log("listings useffect");
    // listings[0] && console.log(`Listing 0 id: ${listings[0].id}`);
    listings.slice(0, visibleListings).forEach((listing) => {
      if (listing.latLong) {
        console.log(listing.latLong);
        console.log(listing.id);
        // need to add to useeffect array
        setMarkers((markers) => [
          ...markers,
          {
            lat: listing.latLong[0],
            lng: listing.latLong[1],
            text: listing.address,
            id: listing.id,
          },
        ]);
        // markers.push( {lat:listing.latLong[0], lng:listing.latLong[1],text:listing.address} );
      }
    });
    console.log({ markers });
  }, [listings, visibleListings]);

  return (
    <div className="map-page-container">
      <Header />
      <div>
        <div className="map-page-search">
          <input
            className="map-page-search-bar"
            type="text"
            placeholder="Search Apartment"
            //onChange={onSearch}
          />
        </div>
        <div className="map-page-listings">
          <div className="map-container">
            <GoogleMap markers={markers} />
          </div>
          <div className="address-list">
            {listings.slice(0, visibleListings).map((listing, index) => (
              <AddressBlock
                url={`/apartment/${listing.id}`}
                address={listing.address}
                s
                bedrooms={listing.bedrooms}
                bathroom={listing.baths}
                imageUrl={listing.imageUrls ? listing.imageUrls[0] : null}
                className="address-list-item"
              />
            ))}
            {visibleListings < listings.length && (
              <button
                onClick={loadMoreListings}
                className="address-list-load-more"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
