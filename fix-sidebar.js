const fs = require('fs');
const file = 'src/components/Sidebar/SidebarNew.jsx';
let content = fs.readFileSync(file, 'utf8');

// The string to find is exactly this:
// className={"nav-link-new " + (location.pathname === "className="nav-link-new" activeClassName="active"" ? "active" : "")}

const findString = `className={"nav-link-new " + (location.pathname === "className="nav-link-new" activeClassName="active"" ? "active" : "")}`;
// We want to replace it with:
// className={(navData) => "nav-link-new " + (navData.isActive ? "active" : "")}

const targetStr = `className={(navData) => "nav-link-new " + (navData.isActive ? "active" : "")}`;

// Use split/join to do an exact string replacement bypassing regex escaping rules
let result = content.split(findString).join(targetStr);

fs.writeFileSync(file, result, 'utf8');
console.log("Replaced instances:", content.split(findString).length - 1);
