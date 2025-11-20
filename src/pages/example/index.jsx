import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="row">
      <div className="col-md-5 mx-auto">
        <form className="m-4">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="圖"
            width="50%"
            className="d-block mx-auto mb-4"
          />
          <div className="mb-3">
            <h1 className="h3 mb-3 font-weight-normal text-center">
              Create an account
            </h1>
            <h2 className="h3 mb-3 font-weight-normal text-center">
              heading h2
            </h2>
            <h2 className="h3 mb-3 font-weight-normal text-center">
              heading h2
            </h2>
            <h3
              className="h3 mb-3 font-weight-normal text-center"
              style={{ fontSize: "10px" }}
            >
              heading h3
            </h3>
            <h4 className="h4 mb-3 font-weight-normal text-center">
              heading h4
            </h4>
            <h3 className="h3 mb-3 font-weight-normal text-center">
              heading h3
            </h3>
            <div>normal div</div>
            <h4 className="h4 mb-3 font-weight-normal text-center">
              heading h4
            </h4>
            <h5 className="h5 mb-3 font-weight-normal text-center">
              heading h5
            </h5>
            <h6
              className="h6 mb-3 font-weight-normal text-center"
              style={{ fontSize: "20px" }}
            >
              heading h6
            </h6>
          </div>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria_labelledby="exampleInputEmail1"
            />
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword2"
            />{" "}
            {/* change exampleInputPassword2 to exampleInputPassword1 */}
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword2" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword"
            />{" "}
            {/* change exampleInputPassword to exampleInputPassword2 */}
          </div>
          <label for="form-check-label" className="form-check-label mb-3">
            I agree to the <Link to="/about">terms and conditions</Link>{" "}
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              aria-label="test"
              type="checkbox"
              value=""
              id="flexCheckChecked1"
            />
            <label className="form-check-label" for="flexCheckChecked1">
              Yes
            </label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              aria-label="go"
              type="checkbox"
              value=""
              id="flexCheckChecked2"
            />
            <label className="form-check-label" for="flexCheckChecked2">
              No
            </label>
          </div>
          <button type="submit" className="btn btn-primary text-primary">
            Submit
          </button>{" "}
          {/* delete text-primary */}
        </form>
        <div className="text-center mt-3">
          <Link to="/example/about" className="btn btn-secondary">
            前往關於我們頁面
          </Link>
        </div>
        <img
          src="https://placehold.co/125x100"
          width="50%"
          className="d-block mx-auto mb-4"
        />
        <img
          src="https://placehold.co/125x100"
          width="50%"
          className="d-block mx-auto mb-4"
          alt="圖片"
        />
        <a href="#">
          <img
            src="https://placehold.co/125x100"
            width="50%"
            className="d-block mx-auto mb-4"
            alt=""
          />
        </a>
        <table>
          <tr>
            <td></td>
            <th scope="col">星期一</th>
            <th scope="col">星期二</th>
            <th scope="col">星期三</th>
            <th scope="col">星期四</th>
            <th scope="col">星期五</th>
          </tr>
          <tr>
            <th scope="row">上午</th>
            <td>休館</td>
            <td>開放</td>
            <td>開放</td>
            <td>開放</td>
            <td>開放</td>
          </tr>
          <tr>
            <th scope="row">下午</th>
            <td>休館</td>
            <td>開放</td>
            <td>開放</td>
            <td>開放</td>
            <td>休館</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Home;
