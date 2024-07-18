import { FormattedMessage } from "react-intl";

const Home = ({ nextHandler }) => {
  return (
    <div className="infoWrapper">
      <div className="info">
        <h1>
          <FormattedMessage id="NAME" />
        </h1>
        <article>
          <h2>
            <FormattedMessage id="HOW_TO_HEADING" />
          </h2>
          <ul>
            <li><FormattedMessage id="BULLET_1" /></li>
            <li><FormattedMessage id="BULLET_2" /></li>
            <li><FormattedMessage id="BULLET_3" /></li>
          </ul>
        </article>
        <div className="buttonsWrapper">
          <button onClick={nextHandler}>
            <FormattedMessage id="HOST" />
          </button>
          <button onClick={(e) => nextHandler(e, 2)}>
            <FormattedMessage id="JOIN" />
          </button>
        </div>
      </div>
    </div >
  )
};

export default Home;