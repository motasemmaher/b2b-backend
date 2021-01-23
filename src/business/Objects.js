//Requiring classes
const Category = require('./Category/Category');
const Product = require('./Product/Product');
const Warehouse = require('./Warehouse/Warehouse');
const Menu = require('./Menu/Menu');
const User = require('./User/User');
const GarageOwner = require('./GarageOwner/GarageOwner');
const CarOwner = require('./CarOwner/CarOwner');
const Store = require('./Store/Store');
const Complaint = require('./Complaint/Complaint');
const Message = require('./Message/Message');
const Offer = require('./Offer/Offer');
const Car = require('./Car/Car');
const ShoppingCart = require('./ShoppingCart/ShoppingCart');
const CartItem = require('./CartItem/CartItem');
const Order = require('./Order/Order');
const Contact = require('./Contact/Contact');
const Chat = require('./Chat/Chat');
const Report = require('./Report/Report');
const Permissions = require('./Permissions/Permissions');

//Objects
const USER = new User();
const GARAGEOWNER = new GarageOwner();
const CAROWNER = new CarOwner();
const STORE = new Store();
const WAREHOUSE = new Warehouse();
const MENU = new Menu();
const CATEGORY = new Category();
const PRODUCT = new Product();
const COMPLAINT = new Complaint();
const MESSAGE = new Message();
const OFFER = new Offer();
const CAR = new Car();
const SHOPPINGCART = new ShoppingCart();
const CARTITEM = new CartItem();
const ORDER = new Order();
const CONTACT = new Contact();
const CHAT = new Chat();
const REPORT = new Report();
const PERMISSIONS = new Permissions();

module.exports = {USER,GARAGEOWNER,CAROWNER,STORE,WAREHOUSE,MENU,CATEGORY,PRODUCT,COMPLAINT,MESSAGE,OFFER,CAR,SHOPPINGCART, CARTITEM, ORDER, PERMISSIONS, REPORT, CONTACT, CHAT};
