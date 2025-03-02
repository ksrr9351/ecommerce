import React from 'react';

const CategorySelector: React.FC = () => {
  const categories = [
    { id: 1, name: "Jacket", icon: "👕" },
    { id: 2, name: "Shirt", icon: "👔" },
    { id: 3, name: "Pants", icon: "👖" },
    { id: 4, name: "Shoes", icon: "👟" },
    { id: 5, name: "Dress", icon: "👗" },
    { id: 6, name: "Accessories", icon: "👓" }
  ];

  return (
    <div className="category-selector">
      <div className="categories-container">
        {categories.map(category => (
          <div key={category.id} className={`category-item ${category.name === 'Shoes' ? 'active' : ''}`}>
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
      <div className="category-brands">
        <span className="brand">Bajuu</span>
        <span className="brand">Kathoc</span>
        <span className="brand">Pernik</span>
        <span className="brand">Spatu</span>
      </div>
    </div>
  );
};

export default CategorySelector;