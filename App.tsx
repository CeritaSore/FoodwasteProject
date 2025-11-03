import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileForm from "./src/pages/ProfileForm";
import Dashboard from "./src/pages/Dashboard";
import MenuRecommendation from "./src/pages/MenuRecommendation";
import AddInventoryItem from "./src/pages/AddInventoryItem";
import WeeklyShopping from "./src/pages/WeeklyShopping";
import AddShoppingItem from "./src/pages/AddShoppingItem";
import Notifications from "./src/pages/Notifications";
import Inventory from "./src/pages/Inventory";

function App() {
  return (
    <Router>
      <Routes>
        {/* home */}
        <Route path="/" element={<Dashboard></Dashboard>}></Route>
        {/* profile */}
        <Route
          path="/profileform"
          element={<ProfileForm></ProfileForm>}
        ></Route>
        {/* notification */}
        <Route
          path="/notification"
          element={<Notifications></Notifications>}
        ></Route>
        {/* recommendation */}
        <Route
          path="/recommendation"
          element={<MenuRecommendation></MenuRecommendation>}
        ></Route>
        {/* inventory */}
        <Route path="/inventory" element={<Inventory></Inventory>}></Route>
        {/* add */}
        <Route
          path="/inventory/add"
          element={<AddInventoryItem></AddInventoryItem>}
        ></Route>
        {/* detail */}
        <Route
          path="/inventory/detail/:id"
          element={<AddInventoryItem></AddInventoryItem>}
        ></Route>
        {/*items  */}
        <Route
          path="/items"
          element={<WeeklyShopping></WeeklyShopping>}
        ></Route>
        {/* add */}
        <Route
          path="/items/add"
          element={<AddShoppingItem></AddShoppingItem>}
        ></Route>
        <Route
          path="/items/detail/:id"
          element={<AddShoppingItem></AddShoppingItem>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
