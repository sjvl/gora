
function Loader() {
  return (
    <svg style={{margin: 'auto', background: 'transparent', display: 'block', shapRendering: 'auto'}} width="300px" height="200px" viewBox="0 0 100 100">
        {/* <text x="26" y="77" font-size="40">g&nbsp;&nbsp;&nbsp;rà</text> */}
        <text x="50" y="23" font-size="40">
          ◍
          <animate attributeName="y" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9" keyTimes="0;0.5;1" values="23;77;23"></animate>
        </text>
    </svg>
  );
}
export default Loader;
