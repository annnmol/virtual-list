import VirtualList from "./components/virtual-list";
import "./App.css";

// Generate some dummy data
const DUMMY_DATA = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  title: `Item ${index}`,
  name: `name ${index}`,
}));

interface ICONTENT {
  id: number;
  title: string;
  name: string;
}

//each item
const renderItem = (item: ICONTENT) => (
  <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
    {item.title}----------{item.name}
  </div>
);

function App() {
  return (
    <div style={{width:"100%", height:"80%" ,}}>
      <h1>Virtual list</h1>
      <VirtualList
        data={DUMMY_DATA}
        itemHeight={50}
        extractKey={(item) => item.id}
        renderItem={renderItem}
        viewPortHeight={1000}
      />
    </div>
  );
}

export default App;
