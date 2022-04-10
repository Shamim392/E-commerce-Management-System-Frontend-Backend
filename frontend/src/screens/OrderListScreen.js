import React, { useEffect, useRef } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { deleteOrder, listOrders } from "../actions/orderActions";
import ReactToPrint from "react-to-print";
import "../assets/css/OrderListScreen.css";

const OrderListScreen = ({ history }) => {
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

  // const deleteHandler = (id) => {
  //   if (window.confirm("Are you want to delete the product?")) {
  //     dispatch(deleteOrder(id));
  //   }
  // };

  return (
    <>
      <Row className="align-items-center pb-2">
        <Col>
          <h1>Orders</h1>
        </Col>
        {/* <Col className="text-right order_print">
          <ReactToPrint
            trigger={() => (
              <div>
                {" "}
                <i className="fas fa-print"></i>
              </div>
            )}
            content={() => componentRef.current}
          />
        </Col> */}
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
