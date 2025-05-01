import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import MainRoutes from '../../routes/MainRoutes';
import { RolesRoute } from './RolesRoute';

// routes config

const { Content } = Layout;

const AppContent = () => {
  return (
    <Content className="site-layout-content" style={{ padding: '24px', minHeight: 280 }}>
      <Suspense fallback={<Spin size="large" />}>
        <Routes>
          {MainRoutes?.map((route, idx) => (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={
                  <RolesRoute roles={route.roles}>
                    <route.element />
                  </RolesRoute>
                }
              />
            )
          ))}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </Content>
  );
};

export default React.memo(AppContent);