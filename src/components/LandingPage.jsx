// src/components/LandingPage.jsx
import React from 'react';

// TESTIMONIALS DATA IN ENGLISH
const testimonialsData = [
    {
        quote: "Maal Tracker clearly showed me where my money was going. I started saving for the first time in my life!",
        name: "Abshir Mohamed",
        title: "University Student"
    },
    {
        quote: "I struggled with budgeting, but this App's clean interface and simplicity made managing money fun. It has made a huge difference.",
        name: "Aisha Abdi",
        title: "Mother and Entrepreneur"
    },
    {
        quote: "The system is fast and reliable. The simple tools provided are exactly what I needed to track my income and expenses easily.",
        name: "Farhan Ali",
        title: "Software Engineer"
    }
];

export default function LandingPage({ onNavigate }) {
    
    return (
        <div>
            {/* 2. HERO SECTION */}
            <section className="hero-section">
                <h1 className="hero-title">
                    Start Managing Your <br />
                    <span style={{ color: '#FFD600' }}>Money</span> Smarter — Today
                </h1>
                
                <p className="hero-subtitle">
                    Join thousands of users who have transformed their financial habits.
                    Simple to use. Powerful in results. Made for you.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <button onClick={() => onNavigate('daily')} className="btn-hero btn-yellow">Daily</button>
                    <button onClick={() => onNavigate('plan')} className="btn-hero btn-black">Plan</button>
                </div>
                
                <p style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
                    * Clicking buttons above starts <b>Demo Mode</b> (Data not saved). Log in to save data.
                </p>
            </section>

            {/* 3. WHY CHOOSE US (Zig-Zag Design) */}
            <section className="features-section">
                <h2 className="section-title">Why Choose Us?</h2>
                <p className="section-sub">Take Control of Your Financial Life<br/>Our platform empowers you to understand, plan, and grow your money.</p>

                <div className="feature-grid">
                    <div className="feature-row row-left"><div className="feature-box box-pink">Track every expense</div></div>
                    <div className="feature-row row-right"><div className="feature-box box-gray">Smart financial insights</div></div>
                    <div className="feature-row row-left"><div className="feature-box box-pink">Simple budgeting tools</div></div>
                    <div className="feature-row row-right"><div className="feature-box box-pink">Savings goal tracking</div></div>
                    <div className="feature-row row-left"><div className="feature-box box-gray">Secure & private platform</div></div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="how-it-works">
                <h2 className="section-title" style={{textAlign:'left'}}>How It Works</h2>
                <div className="step-item">
                    <span className="step-title">1. Create Your Account</span>
                    <span className="step-desc">Quick registration — requires minimal setup.</span>
                </div>
                <div className="step-item">
                    <span className="step-title">2. Add Your Daily Expenses</span>
                    <span className="step-desc">Record your spending in seconds.</span>
                </div>
                <div className="step-item">
                    <span className="step-title">3. Get Instant Insights</span>
                    <span className="step-desc">Instantly view charts, summaries, and savings progress.</span>
                </div>
            </section>

            {/* 5. TESTIMONIALS */}
            <section style={{textAlign:'center'}}>
                <h2 className="section-title">Testimonials</h2>
                <div className="testimonials-grid">
                    {testimonialsData.map((review, index) => (
                        <div key={index} className="testimonial-card">
                            <span className="quote-mark">“</span>
                            <p style={{marginBottom: '20px', fontStyle: 'italic', color: '#333', fontSize:'15px'}}>{review.quote}</p>
                            <div style={{fontWeight:'bold', fontSize:'15px', color: '#000'}}>- {review.name}</div>
                            <div style={{color:'#999', fontSize:'13px'}}>{review.title}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}