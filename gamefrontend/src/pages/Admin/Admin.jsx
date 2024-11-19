import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import Menu from './Menu.jsx';
import GamePage from './GamePage.jsx';
import UserPage from './UserPage.jsx';
import RequestList from './PublisherRequest.jsx';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("home"); // State để quản lý tab hiện tại

    return (
        <Container fluid>
            <style>
                {`
                    .sidebar {
                        min-height: 100vh;
                        padding-top: 20px;
                        border-right: 1px solid #ddd;
                    }
                `}
            </style>
            <Row>
                {/* Cột bên trái chứa các mục điều hướng */}
                <Col sm={3} md={2} className="bg-light sidebar">
                    <Nav
                        variant="pills"
                        className="flex-column"
                        activeKey={activeTab}
                        onSelect={(selectedTab) => setActiveTab(selectedTab)}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="home">Trang Chủ</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="game">Game</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="user">User</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="request">Publisher Request</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>

                {/* Cột bên phải chứa nội dung chính của từng trang */}
                <Col sm={9} md={10}>
                    <Tab.Container activeKey={activeTab}>
                        <Tab.Content>
                            <Tab.Pane eventKey="home">
                                <Menu />
                            </Tab.Pane>
                            <Tab.Pane eventKey="game">
                                <GamePage />
                            </Tab.Pane>
                            <Tab.Pane eventKey="user">
                                <UserPage/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="request">
                                <RequestList/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPage;
