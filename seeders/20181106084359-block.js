module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('blocks', [{
      sender: 'John Doe',
      version: 1,
      blockId: 1,
      time: new Date(),
      size: 256,
      txcnt: 1,
      txlist: JSON.stringify({'transaction': 1}),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sender: 'John Doe',
      version: 1,
      blockId: 1,
      time: new Date(),
      size: 256,
      txcnt: 1,
      txlist: JSON.stringify({'transaction': 1}),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sender: 'John Doe',
      version: 1,
      blockId: 1,
      time: new Date(),
      size: 256,
      txcnt: 1,
      txlist: JSON.stringify({'transaction': 1}),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sender: 'John Doe',
      version: 1,
      blockId: 1,
      time: new Date(),
      size: 256,
      txcnt: 1,
      txlist: JSON.stringify({'transaction': 1}),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {
      sender: 'John Doe',
      version: 1,
      blockId: 1,
      time: new Date(),
      size: 256,
      txcnt: 1,
      txlist: JSON.stringify({'transaction': 1}),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sender: 'John Doe',
      version: 1,
      blockId: 1,
      time: new Date(),
      size: 256,
      txcnt: 1,
      txlist: JSON.stringify({'transaction': 1}),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('blocks', null, {})
  }
}
