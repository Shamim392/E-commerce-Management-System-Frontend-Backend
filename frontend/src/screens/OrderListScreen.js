import React, { useEffect, useRef, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { deleteOrder, listOrders } from "../actions/orderActions";
import ReactToPrint from "react-to-print";
import "../assets/css/OrderListScreen.css";

const OrderListScreen = ({ history }) => {
  // const [orders, setOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState();
  const [dateRangeStart, setdateRangeStart] = useState();
  const [dateRangeLast, setdateRangeLast] = useState();

  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // for Print and pdf
  const componentRef = useRef();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    // console.log(searchText);
    const matchedOrders = orders.filter((order) =>
      order._id.includes(searchText)
    );
    // setDisplayOrders(matchedOrders);
    console.log(matchedOrders);
    orders = matchedOrders;
  };
  // console.log(displayOrders);

  // search by date
  const handleDateSearch = (e) => {
    const dateValue = new Date(e.target.value).toLocaleDateString();
    setSearchDate(dateValue);
    const matchedOrders = orders.filter(
      (order) => order?.orderDate === dateValue
    );
    // setDisplayOrders(matchedOrders);
  };

  //handle inputs for range
  const handleRangeStart = (e) => {
    setdateRangeStart(e.target.value);
  };

  const handleRangeLast = (e) => {
    setdateRangeLast(e.target.value);
  };

  //handle range search
  const handleSearchRange = () => {
    const ordersByRange = orders.filter(
      (order) =>
        (new Date(dateRangeStart) < new Date(order.orderDate) &&
          new Date(dateRangeLast) > new Date(order.orderDate)) ||
        new Date(dateRangeStart).toDateString() ===
          new Date(order.orderDate).toDateString() ||
        new Date(dateRangeLast).toDateString() ===
          new Date(order.orderDate).toDateString()
    );
    // setDisplayOrders(ordersByRange);
    // console.log(ordersByRange);
  };

  return (
    <>
      <Row className="align-items-center pb-2">
        <Col>
          <h1>Orders</h1>
        </Col>
        <div className="order_print">
          <ReactToPrint
            trigger={() => (
              <div>
                {" "}
                <i className="fas fa-print"></i>
              </div>
            )}
            content={() => componentRef.current}
          />
        </div>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="">
          <h3 className="text-center mb-4 fw-bold my-3">Manage all Orders</h3>

          {/* search container  */}
          <div className="row search_div">
            <div className="col-md-7 ">
              <div className="">
                <input
                  className="search_input"
                  type="text"
                  placeholder="Search By Product Id"
                  onChange={handleSearch}
                />
              </div>
            </div>
            {/* search by date container  */}
            <div className="col-md-5 d-flex justify-content-center align-items-center search_date">
              <label htmlFor="dateSearch">Search By Date :- </label>
              <br />
              <input
                className="search_input"
                type="date"
                onChange={handleDateSearch}
              />
            </div>
          </div>
          <div className="row my-2 date_search">
            <div className="col-12 S ">
              <h5 className=" text-dark search_heading ">
                Search By Orders Date Range
              </h5>
              <div className="d-flex align-items-center">
                <div className="d-flex justify-content-center align-items-center my-2">
                  <label htmlFor="from">Orders From :- </label>
                  <input
                    className="search_input"
                    type="date"
                    // className="form-control"
                    onChange={handleRangeStart}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center me-2">
                  <label className="mx-2" htmlFor="to">
                    To
                  </label>
                  <input
                    className="search_input"
                    type="date"
                    // className="form-control"
                    onChange={handleRangeLast}
                  />
                </div>
                <div>
                  <button className="se_button" onClick={handleSearchRange}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Table
            ref={componentRef}
            striped
            bordered
            hover
            responsive
            className="table-sm"
          >
            <thead>
              <tr>
                {/* <th>NAME</th> */}
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>

                    {/* <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(order._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default OrderListScreen;
