export const navBarData = [
  {
    routeLink: 'dashboard',
    icon: 'fa fa-home',
    label: 'Dashboard',
  },
  {
    routeLink: 'product',
    icon: 'fa fa-shopping-bag',
    label: 'Product',
    open: false,
    subMenu: [
      {
        routeLink: 'add-product',
        icon: 'fa fa-plus-square-o',
        label: 'Add Product',
      },
      {
        routeLink: 'product-list',
        icon: 'fa fa-list',
        label: 'Product List',
      },
    ],
  },
  {
    routeLink: 'category',
    icon: 'fa fa-object-group',
    label: 'Category',
    open: false,
    subMenu: [
      {
        routeLink: 'category-list',
        icon: 'fa fa-list',
        label: 'Category List',
      },
    ],
  },
  {
    routeLink: 'logout',
    icon: 'fa fa-power-off',
    label: 'Logout',
  },
];
