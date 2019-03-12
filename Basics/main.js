const db = require('gun')();
const car = db.get("123").put({
  make: "Toyota",
  model: "Camry",
});
car.once(v => console.log(v.make)); // --> Toyota

const node = db.get("1122").once();

const node1 = db.get("3344").put({
    name: "node1"
  });
  node1.get("doc1").put({
    name: "doc1",
  });
  node1.get("doc1").get("sub_doc").put({
    name: 'sub_doc',
  });

  node1.get('doc1').get('sub_doc').once(v => console.log(v));


  const n1 = db.get('5416')
  .put({
    name: 'n1',
    prop: '...',
    doc1: {
      prop: '...',
    },
  });

const n2 = db.get('8899')
  .put({
    name: 'n2',
    doc2: {
      prop: '...',
    }
  });

n1.get('related_to').put(n2);


node1.get('related_to').put({
    property: "value",
    property2: "value",
  });
  node1.get('related_to').get('node').put(node2);