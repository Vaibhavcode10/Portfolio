import { useState } from "react";
import "./RobotBuddy.css";

const RobotBuddy = () => {
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  const followPointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    setGaze({ x, y });
  };

  return (
    <div
      className="robot-buddy"
      role="img"
      aria-label="A golden robot head that follows your pointer"
    >
      <div
        className="robot-stage"
        onPointerMove={followPointer}
        onPointerLeave={() => setGaze({ x: 0, y: 0 })}
      >
        <div
          className="robot-head"
          style={{
            "--head-yaw": `${gaze.x * 24}deg`,
            "--head-pitch": `${gaze.y * -22}deg`,
            "--gaze-x": `${gaze.x * 5}px`,
            "--gaze-y": `${gaze.y * 4}px`,
          }}
        >
          <div className="robot-antenna">
            <span />
          </div>
          <div className="robot-ear robot-ear-left" />
          <div className="robot-ear robot-ear-right" />
          <div className="robot-face">
            <div className="robot-brow" />
            <div className="robot-eyes">
              <span><i /></span>
              <span><i /></span>
            </div>
            <div className="robot-cheeks">
              <span />
              <span />
            </div>
            <div className="robot-mouth" />
          </div>
          <div className="robot-chin" />
        </div>
      </div>
    </div>
  );
};

export default RobotBuddy;
