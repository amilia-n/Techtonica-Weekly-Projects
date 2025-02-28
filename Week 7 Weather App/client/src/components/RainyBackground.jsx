const RainyBackground = () => {
  return (
    <div className="container">
      <div className="rainyDay">
        <div className="umbrella">
          <input id='panel' type='checkbox' />
          <label className='panel' htmlFor='panel'></label>
          <div className="stick"></div>
        </div>
        <div className="rain">
          <div className="dropletOne"></div>
          <div className="dropletTwo"></div>
          <div className="dropletThree"></div>
          <div className="dropletFour"></div>
          <div className="dropletFive"></div>
        </div>
      </div>
    </div>
  );
};

export default RainyBackground; 