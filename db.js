const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const Gym = sequelize.define('Gym', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  indixes: [{
    unique: true,
    fields: ['name'],
  }]
});

const Source = sequelize.define('Source', {
  type: {
    type: DataTypes.STRING,
    defaultValue: 'ROCK_GYM_PRO',
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
  }
});
Gym.Source = Gym.hasOne(Source);
Source.Gym = Source.belongsTo(Gym);

const Tick = sequelize.define('Tick', {
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

Gym.Ticks = Gym.hasMany(Tick);
Tick.Gym = Tick.belongsTo(Gym);

function getSources() {
  return Source.findAll({
    where: {
      type: 'ROCK_GYM_PRO',
    }
  });
}

async function addTick(source, occupancy) {
  const gym = await source.getGym();
  return gym.createTick({
    time: Date.now(),
    count: occupancy,
  });
}

async function getTicks() {
  return Gym.findAll({
    include: {
      model: Tick,
      where: {
        time: {
          [Op.gt]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }
  });
}

module.exports = {
    init(force) {
        return sequelize.sync({ force });
    },
    async seed() {
      await Gym.create({
        name: "Fremont",
        Source: {
          type: 'ROCK_GYM_PRO',
          data: {
            short: 'FRE',
            uuid: '314b60a77a6eada788f8cd7046931fc5',
          },
        },
      }, {
        include: [Gym.Source],
      });
      await Gym.create({
        name: "Poplar",
        Source: {
          type: 'ROCK_GYM_PRO',
          data: {
            short: 'POP',
            uuid: '314b60a77a6eada788f8cd7046931fc5',
          },
        },
      }, {
        include: [Gym.Source],
      });
      await Gym.create({
        name: "Upper Walls",
        Source: {
          type: 'ROCK_GYM_PRO',
          data: {
            short: 'UPW',
            uuid: '314b60a77a6eada788f8cd7046931fc5',
          },
        },
      }, {
        include: [Gym.Source],
      });
    },
    getSources,
    addTick,
    getTicks,
};