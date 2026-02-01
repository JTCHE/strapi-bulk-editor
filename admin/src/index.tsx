import { DesignSystemProvider } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import ReactDOM from 'react-dom/client';
import { ModalManager, openBulkEditModal } from './components/ModalManager';

export default {
  register(app: any) {
    app.registerPlugin({
      id: 'bulk-editor',
      name: 'Bulk Editor',
    });
  },

  bootstrap(app: any) {
    // Create a div for the modal manager and render it once
    const modalRoot = document.createElement('div');
    modalRoot.id = 'bulk-editor-modal-root';
    document.body.appendChild(modalRoot);

    const root = ReactDOM.createRoot(modalRoot);
    root.render(
      <DesignSystemProvider locale="en">
        <ModalManager />
      </DesignSystemProvider>
    );

    const contentManager = app.getPlugin('content-manager');

    if (contentManager && contentManager.apis) {
      contentManager.apis.addBulkAction([
        function BulkEditAction({ documents, model }: { documents: any[]; model: string }) {
          // Access hooks here where we have proper context
          const toggleNotification = useNotification();
          const fetchClient = useFetchClient();

          const handleClick = () => {
            openBulkEditModal(documents, model, toggleNotification, fetchClient);
          };

          // Return props object that works
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
