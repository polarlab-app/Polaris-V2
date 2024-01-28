const economy = require('../../schemas/economy');

module.exports = async (polaris) => {
    if(!await economy.findOne({ name: 'jobs'})) {
        jobs = new economy({
            name: 'jobs',
            array: [
                {
                    "name": "Astronaut",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 1200000
                        },
                        {
                            "name": "requirement",
                            "value": 95
                        }
                    ]
                },
                {
                    "name": "Scientist",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 1000000
                        },
                        {
                            "name": "requirement",
                            "value": 90
                        }
                    ]
                },
                {
                    "name": "Doctor",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 950000
                        },
                        {
                            "name": "requirement",
                            "value": 85
                        }
                    ]
                },
                {
                    "name": "Lawyer",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 930000
                        },
                        {
                            "name": "requirement",
                            "value": 80
                        }
                    ]
                },
                {
                    "name": "Business Man",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 780000
                        },
                        {
                            "name": "requirement",
                            "value": 70
                        }
                    ]
                },
                {
                    "name": "Politician",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 690000
                        },
                        {
                            "name": "requirement",
                            "value": 65
                        }
                    ]
                },
                {
                    "name": "Developer",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 330000
                        },
                        {
                            "name": "requirement",
                            "value": 60
                        }
                    ]
                },
                {
                    "name": "Manager",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 270000
                        },
                        {
                            "name": "requirement",
                            "value": 55
                        }
                    ]
                },
                {
                    "name": "Musician",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 210000
                        },
                        {
                            "name": "requirement",
                            "value": 50
                        }
                    ]
                },
                {
                    "name": "Teacher",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 190000
                        },
                        {
                            "name": "requirement",
                            "value": 45
                        }
                    ]
                },
                {
                    "name": "Police Officer",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 170000
                        },
                        {
                            "name": "requirement",
                            "value": 40
                        }
                    ]
                },
                {
                    "name": "Singer",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 100000
                        },
                        {
                            "name": "requirement",
                            "value": 35
                        }
                    ]
                },
                {
                    "name": "Engineer",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 40000
                        },
                        {
                            "name": "requirement",
                            "value": 30
                        }
                    ]
                },
                {
                    "name": "Youtuber",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 20000
                        },
                        {
                            "name": "requirement",
                            "value": 25
                        }
                    ]
                },
                {
                    "name": "Discord Mod",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 5000
                        },
                        {
                            "name": "requirement",
                            "value": 20
                        }
                    ]
                },
                {
                    "name": "Maid",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 3500
                        },
                        {
                            "name": "requirement",
                            "value": 15
                        }
                    ]
                },
                {
                    "name": "Robber",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 2000
                        },
                        {
                            "name": "requirement",
                            "value": 10
                        }
                    ]
                },
                {
                    "name": "Janitor",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 700
                        },
                        {
                            "name": "requirement",
                            "value": 5
                        }
                    ]
                },
                {
                    "name": "Beggar",
                    "properties": [
                        {
                            "name": "pay",
                            "value": 200
                        },
                        {
                            "name": "requirement",
                            "value": 0
                        }
                    ]
                }
            ]
        })

        await jobs.save()
    } else {
        return;
    }
}