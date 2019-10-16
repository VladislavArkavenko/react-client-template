import React from 'react';
import RateItem from './RateItem';

const SidebarItem = ({ title }) => (
  <li className="sidebar-item">
    <span>{title}</span>
  </li>
);

export default function TopScoresChart({ data }) {
  const sidebarList = [];
  const rateList = [];

  data.slice(0, 10).forEach(({ min, max, median, customerRate, topicId, topicName }) => {
    sidebarList.push(<SidebarItem key={`${topicId}_c_s`} title={topicName} />);
    rateList.push(
      <RateItem
        key={`${topicId}_c_r`}
        min={min}
        max={max}
        median={median}
        customerRate={customerRate}
      />
    );
  });

  return (
    <div className="top-scores">
      <div className="top-scores__container">
        <ul className="top-scores__sidebar">{sidebarList}</ul>
        <ul className="top-scores__main">{rateList}</ul>
      </div>
      <div className="legend-wrapper">
        <div className="legend-spacer" />
        <div className="legend-container">
          <div className="legend-content">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
