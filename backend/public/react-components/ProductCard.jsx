import React from 'react';
import './ProductCard.css'; // Assuming styles are imported here or globally

const ProductCard = ({
  image,
  name,
  description,
  prices = {},
  farmerName,
  availability,
  userRole,
  onConnect,
  onEdit,
  onDelete
}) => {
  const { price20, price50, price100 } = prices;

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={image || 'https://via.placeholder.com/160'} alt={name} />
      </div>
      <div className="product-card-content">
        <div>
          <div className="product-header">
            <h3 className="product-title">{name}</h3>
          </div>
          <p className="product-desc">{description}</p>

          <div className="farmer-info">
            <span className="farmer-badge">
              👤 {farmerName}
            </span>
          </div>

          <div className="price-list">
            {price20 && (
              <div className="price-item">
                20 kg: <span>₹{price20.toLocaleString('en-IN')}</span>
              </div>
            )}
            {price50 && (
              <div className="price-item">
                50 kg: <span>₹{price50.toLocaleString('en-IN')}</span>
              </div>
            )}
            {price100 && (
              <div className="price-item">
                100 kg: <span>₹{price100.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card-footer">
          <span className="availability">{availability}</span>

          <div className="action-icons">
            {userRole === 'buyer' && (
              <button
                className="icon-btn"
                onClick={onConnect}
                title="Chat with Farmer"
              >
                💬
              </button>
            )}

            {userRole === 'farmer' && (
              <>
                <button
                  className="icon-btn"
                  onClick={onEdit}
                  title="Edit Product"
                >
                  ✏️
                </button>
                <button
                  className="icon-btn delete"
                  onClick={onDelete}
                  title="Delete Product"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
