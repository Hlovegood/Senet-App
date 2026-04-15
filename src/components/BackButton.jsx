import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './BackButton.css';

export default function BackButton({ to = "-1" }) {
  return (
    <Link to={to} className="custom-back-circle">
      <ChevronLeft size={24} color="#fff" />
    </Link>
  );
}