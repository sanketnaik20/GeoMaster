import React from 'react';
import './BgIllustration.css';

const BgIllustration = React.memo(() => (
  <div className="bg-illustration" aria-hidden="true">
    <div className="shape circle-1"></div>
    <div className="shape circle-2"></div>
  </div>
));

export default BgIllustration;
