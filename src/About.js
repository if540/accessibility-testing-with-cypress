import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="row">
      <div className="col-md-8 mx-auto">
        <div className="m-4">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" width="200" className="d-block mx-auto mb-4"/>
          <h1 className="h1 mb-4 text-center">關於我們</h1>
          
          <div className="content">
            <h2 className="h3 mb-3">我們的故事</h2>
            <p className="mb-4">
              歡迎來到我們的網站！我們致力於提供優質的服務和產品，
              並持續改善使用者體驗。我們的團隊充滿熱忱，專注於創新和品質。
            </p>
            
            <h2 className="h3 mb-3">我們的使命</h2>
            <p className="mb-4">
              我們的使命是透過技術創新，為使用者創造價值，
              並建立一個更美好的數位世界。我們相信每個細節都很重要，
              從無障礙設計到使用者介面，我們都努力做到最好。
            </p>
            
            <h2 className="h3 mb-3">聯絡我們</h2>
            <p className="mb-4">
              如果您有任何問題或建議，歡迎隨時與我們聯絡。
              我們很樂意聽到您的想法和回饋。
            </p>
            
            <div className="text-center mt-5">
              <Link to="/" className="btn btn-primary">
                返回首頁
              </Link>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">Gender</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>John</td>
                <td>25</td>
                <td>Male</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jane</td>
                <td>26</td>
                <td>Female</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default About;
