import React, { Component, useEffect, useState } from 'react';
import { useBoundStore } from '@/store/boundStore';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import ToggleComponent from '@/components/common/Toggle';
import { Checkbox } from '@/components/ui/checkbox';
import { Position, useSettingsStore } from '@/store';
import { cn } from '@/lib/utils';
import { ComponentBase, LayoutBase, Page } from '@/store/ComponentTypes';

interface ImportShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: any; // Replace with the appropriate type for your store
}
type SelectedPage = {
  name: string;
  id: string;
  components: string[];
};

const ImportShowModal: React.FC<ImportShowModalProps> = ({
  isOpen,
  onClose,
  store,
}) => {
  const [pages, setPages] = useState<SelectedPage[]>([]);
  const [selectedPages, setSelectedPages] = useState<SelectedPage[]>([]);

  //   const components = useBoundStore((state) => state.components);
  //

  const { addPages, addComponents, addPositions, addLayouts } = useBoundStore();
  const setProjectSettings = useSettingsStore(
    (state) => state.setProjectSettings,
  );
  const removeAllComponents = useBoundStore(
    (state) => state.removeAllComponents,
  );
  useEffect(() => {
    if (store && store.componentStore) {
      console.log('store that was loaded', store);
      const parsedPages = store.componentStore.pages.map(
        (page: any, index: number) => {
          return {
            name: `${index + 1}`,
            components: page.components,
            id: page.id,
          };
        },
      );
      setPages(parsedPages);
    }
  }, [store]);

  const handleSelectAll = (isChecked: boolean) => {
    const newSelectedPages: SelectedPage[] = [];
    if (isChecked) {
      pages.forEach((page, index) => {
        newSelectedPages.push({
          name: `${index + 1}`,
          id: page.id,
          components: page.components,
        });
      });
    }
    console.log(newSelectedPages);
    setSelectedPages(newSelectedPages);
  };

  const handlePageSelect = (page: SelectedPage) => {
    let newSelectedPages = [...selectedPages];
    console.log(page);
    if (newSelectedPages.find((p) => p.id === page.id)) {
      newSelectedPages = newSelectedPages.filter((p) => p.id !== page.id);
    } else {
      newSelectedPages.push(page);
    }
    console.log(newSelectedPages);
    setSelectedPages(newSelectedPages);
  };

  const handleImport = () => {
    // Logic to import selected pages/components
    console.log('Importing pages:', Array.from(selectedPages));
    useBoundStore.setState(store.componentStore);
    useSettingsStore.setState(store.settingsStore);
    onClose();
  };
  const handleImportToCurrentShow = () => {
    console.log('Importing pages:', Array.from(selectedPages));

    const selectedComponents = new Set<ComponentBase>();
    const selectedPositions = new Set<Position>();
    const selectedLayouts = new Set<LayoutBase>();
    const selectedFullPages = new Set<Page>();

    selectedPages.forEach((selectedPage) => {
      const page: Page = store.componentStore.pages.find(
        (p: Page) => p.id === selectedPage.id,
      );
      console.log('page', page);
      selectedFullPages.add(page);
      if (page) {
        // Add components from the selected page
        page.components.forEach((componentId: string) => {
          const component = store.componentStore.components[componentId];
          const layout = store.componentStore.layouts[componentId];
          if (component) {
            selectedComponents.add(component);
            if (component.type === 'multi') {
              // If it's a multi-component, add its child components
              component.components.forEach((childId: string) => {
                const component = store.componentStore.components[childId];
                if (component) {
                  selectedComponents.add(component);
                }
                //   selectedComponents.add(childId);
              });
            }
          }
          if (layout) {
            selectedLayouts.add(layout);
          }
          // Add positions for the components in the page
        });
        page.components.forEach((componentId: string) => {
          const position = store.componentStore.positions[componentId];
          if (position) {
            selectedPositions.add(position);
          }
        });
      }
    });

    // Add pages, components, and positions to the store

    addPages(Array.from(selectedFullPages));
    addComponents(Array.from(selectedComponents));
    addPositions(Array.from(selectedPositions));
    addLayouts(Array.from(selectedLayouts)); // Assuming you have a method to add layouts
    onClose();
  };
  const initialState = useSettingsStore((state) => ({
    ip: state.ip || '',
    port: state.port || '',
    pageHeight: state.pageHeight || 1920,
    pageWidth: state.pageWidth || 1080,
    projectName: '',
    projectDescription: '',
  }));

  const handleImportToNewShow = () => {
    console.log('Importing pages:', Array.from(selectedPages));
    const selectedComponents = new Set<ComponentBase>();
    const selectedPositions = new Set<Position>();
    const selectedLayouts = new Set<LayoutBase>();
    const selectedFullPages = new Set<Page>();

    selectedPages.forEach((selectedPage) => {
      const page: Page = store.componentStore.pages.find(
        (p: Page) => p.id === selectedPage.id,
      );
      console.log('page', page);
      selectedFullPages.add(page);
      if (page) {
        // Add components from the selected page
        page.components.forEach((componentId: string) => {
          const component = store.componentStore.components[componentId];
          const layout = store.componentStore.layouts[componentId];
          if (component) {
            selectedComponents.add(component);
            if (component.type === 'multi') {
              // If it's a multi-component, add its child components
              component.components.forEach((childId: string) => {
                const component = store.componentStore.components[childId];
                if (component) {
                  selectedComponents.add(component);
                }
                //   selectedComponents.add(childId);
              });
            }
          }
          if (layout) {
            selectedLayouts.add(layout);
          }
          // Add positions for the components in the page
        });
        page.components.forEach((componentId: string) => {
          const position = store.componentStore.positions[componentId];
          if (position) {
            selectedPositions.add(position);
          }
        });
      }
    });

    // useSettingsStore.setState(store.settingsStore);
    removeAllComponents();
    useBoundStore.setState({
      pages: Array.from(selectedFullPages),
      currentPage: selectedFullPages.values().next().value.id,
      currentPageIndex: 0,
    });

    // addPages(Array.from(selectedFullPages));
    addComponents(Array.from(selectedComponents));
    addPositions(Array.from(selectedPositions));
    addLayouts(Array.from(selectedLayouts)); // Assuming you have a method to add layouts

    setProjectSettings({
      ...initialState,
      projectName: '',
      projectDescription: '',
    });
    //open new project settings

    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      {/* <AlertDialogTrigger asChild>
        <Button variant="secondary">Import Show</Button>
      </AlertDialogTrigger> */}
      <AlertDialogContent className="w-full max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
            Import Show
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 dark:text-gray-300">
            Select Pages you want to add to current Show.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <ToggleComponent
                  //   label="All"
                  value={selectedPages.length === pages.length}
                  setValue={handleSelectAll}
                />
                {/* <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={selectedPages.size === pages.length}
                  className="peer"
                />
                Select All */}
              </TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Components</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow
                key={page.name}
                onClick={() => handlePageSelect(page)}
                // selected={selectedPages.has(page.name)}
                className={cn(
                  selectedPages.find((p) => p.id === page.id) &&
                    'bg-gray-100 dark:bg-gray-800',
                )}
              >
                <TableCell>
                  <Checkbox
                    className="peer"
                    checked={
                      selectedPages.find((p) => p.id === page.id) !== undefined
                    }
                    onCheckedChange={() => handlePageSelect(page)}
                  />
                </TableCell>
                <TableCell className="dark:text-gray-100">
                  {page.name}
                </TableCell>
                <TableCell>
                  {page.components
                    .filter((v) => !store.componentStore.layouts[v])
                    .map((componentId, index) => {
                      const component =
                        store.componentStore.components[componentId];
                      //   const layout = store.componentStore.layouts[componentId];
                      //   if (layout) return null;
                      // console.log('component', componentId);
                      return (
                        <span
                          key={componentId}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {component ? component.gui_name : 'Unknown Component'}
                          {index <
                          page.components.filter(
                            (v) => !store.componentStore.layouts[v],
                          ).length -
                            1
                            ? ', '
                            : ''}
                        </span>
                      );
                    })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleImportToNewShow}>
            Import Pages To New Show
          </AlertDialogAction>
          <AlertDialogAction onClick={handleImportToCurrentShow}>
            Import Pages To Current Show
          </AlertDialogAction>
          <AlertDialogAction onClick={handleImport}>
            Import Full Show
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportShowModal;
