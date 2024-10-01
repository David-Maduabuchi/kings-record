import { useEffect } from "react";
import { NavLink } from "react-router-dom"; // Use Link if React Router is installed
import "./NotFound.scss";

const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = "404 | NotFound";
  }, []);

  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center ">404</h1>
              </div>

              <div className="contant_box_404">
                <h3 className="h2">Looks like you're lost</h3>

                <p>The page you are looking for does not exist☹️!</p>

                <NavLink to="/admin/dashboard" className="link_404">
                  Go to Home
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
