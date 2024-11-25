import React, { useState } from 'react';
import bannerimage from '../../assets/bannerimage.jpg'


const Banner =()=> {
    return (
        <section style={styles.highYieldSection}>
          <div style={styles.textContent}>
            <h1 style={styles.heading}>High-Yield Solutions For Publishers</h1>
            <p style={styles.paragraph}>Discover the advantages of partnering with GameDistribution</p>
            <button style={styles.showMoreButton}>Show More &rarr;</button>
          </div>
          <div style={styles.imageContent}>
            <img 
              src={bannerimage} 
              alt="Banner image" 
              style={styles.image}
            />
          </div>
        </section>
      );
    };
    
    // Style object
    const styles = {
      highYieldSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: 'dark-subtle',
      },
      textContent: {
        textAlign: 'center',
        marginBottom: '20px',
      },
      heading: {
        fontSize: '2.5rem',
        color: '#5c3cba',
        marginBottom: '15px',
      },
      paragraph: {
        fontSize: '1.2rem',
        color: '#6c757d',
        marginBottom: '20px',
      },
      showMoreButton: {
        backgroundColor: '#f8f9fa',
        color: '#5c3cba',
        border: '1px solid #5c3cba',
        padding: '10px 20px',
        fontSize: '1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      },
      showMoreButtonHover: {
        backgroundColor: '#5c3cba',
        color: '#fff',
      },
      imageContent: {
        display: 'flex',
        justifyContent: 'center',
      },
      image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '10px',
      },
    };
export default Banner;
    