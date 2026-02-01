import { Pencil } from '@strapi/icons';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import React from 'react';
import { ModalManager, openBulkEditModal } from './components/ModalManager';

// Global component that wraps the app
const BulkEditorProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ModalManager />
    </>
  );
};

export default {
  register(app: any) {
    app.registerPlugin({
      id: 'bulk-editor',
      name: 'Bulk Editor',
    });
  },

  bootstrap(app: any) {
    // Inject ModalManager into app layout
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'bulk-editor-modal',
      Component: () => <ModalManager />,
    });

    const contentManager = app.getPlugin('content-manager');

    if (contentManager && contentManager.apis) {
      contentManager.apis.addBulkAction([
        function BulkEditAction({ documents, model }: { documents: any[]; model: string }) {
          const toggleNotification = useNotification();
          const fetchClient = useFetchClient();

          const handleClick = () => {
            openBulkEditModal(documents, model, toggleNotification, fetchClient);
          };

          return {
            label: 'Bulk Edit',
            icon: <Pencil />,
            onClick: handleClick,
            children: 'Bulk Edit',
            variant: 'secondary',
          };
        },
      ]);
    }
  },

  async registerTrads(app: any) {
    return [];
  },
};
