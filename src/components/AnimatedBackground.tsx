
const AnimatedBackground = () => {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars absolute inset-0"></div>
        <div className="stars2 absolute inset-0"></div>
        <div className="stars3 absolute inset-0"></div>
      </div>

      <style>{`
        .stars {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 1776px 1684px #fff, 1350px 1676px #fff, 1162px 1055px #fff, 1510px 1607px #fff, 1076px 1644px #fff, 1582px 1206px #fff, 1072px 1936px #fff, 1683px 1072px #fff, 1853px 1207px #fff, 1709px 1513px #fff;
          animation: animStar 50s linear infinite;
        }
        .stars2 {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: 481px 1538px #fff, 1650px 1050px #fff, 1762px 1836px #fff, 1489px 1722px #fff, 1676px 1684px #fff, 1802px 1774px #fff, 1774px 1725px #fff, 1809px 1644px #fff, 1693px 1158px #fff, 1853px 1404px #fff;
          animation: animStar 100s linear infinite;
        }
        .stars3 {
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: 1350px 1838px #fff, 1678px 1564px #fff, 1831px 1038px #fff, 1693px 1678px #fff, 1676px 1136px #fff, 1869px 1158px #fff, 1685px 1136px #fff, 1715px 1025px #fff, 1684px 1855px #fff, 1769px 1684px #fff;
          animation: animStar 150s linear infinite;
        }
        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;
