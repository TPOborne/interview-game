const Home = ({ nextHandler }) => {
  return (
    <div className="infoWrapper">
      <div className="info">
        <h1>Word Race</h1>
        <article>
          <h2>How to play</h2>
          <ul>
            <li>Host or join a lobby</li>
            <li>Makes words before the<br />others to score points</li>
            <li>Most points wins</li>
          </ul>
        </article>
        <div className="buttonsWrapper">
          <button onClick={nextHandler}>Host</button>
          <button onClick={(e) => nextHandler(e, 2)}>Join</button>
        </div>
      </div>
    </div >
  )
};

export default Home;