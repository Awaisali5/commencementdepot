const users = [
    {
        name: "John Doe",
        email: "john@example.com",
        password: "123456@Ab",
        address1: "mumbai",
        zipCode: "400001",
        phone: "9922334455",
        countryCode: "+91",
        billingName: "Sita",
        billingCardNumber: "1234567890123456",
        billingExpiration: "05/24",
        billingCVC: "321",
        universityName: "mit",
        billingAddress: "mumbai",
        cart:[
            {
                id: "1",
                date: "2024-16-15",
                items:[
                    {productId: 4,price: 15,quantity: 3,selectedSize: "One Size"}

                ]
            }
        ],
        orders: [
            {
                id: "1",
                status: "Shipped",
                date: "2024-11-15",
                items: [
                    { productId: 1, quantity: 1,  selectedSize: "5ft 6in"}, // Reference the product by its id
                    { productId: 2, quantity: 1,selectedSize: "5ft 0in"},
                ],
            },
            {
                id: "2",
                status: "Delivered",
                date: "2024-11-12",
                items: [
                    { productId: 3, quantity: 1 , selectedSize: "One Size"}, // Reference the product by its id
                ],
            },
            {
                id: "3",
                status: "Shipped",
                date: "2024-11-15",
                items: [
                    { productId: 1, quantity: 1,selectedSize: "5ft 6in"  }, // Reference the product by its id
                    { productId: 2, quantity: 1 ,selectedSize: "5ft 6in"},
                ],
            },
            {
                id: "4",
                status: "Shipped",
                date: "2024-11-15",
                items: [
                    { productId: 1, quantity: 1 , selectedSize: "5ft 6in"}, // Reference the product by its id
                    { productId: 2, quantity: 1,selectedSize: "5ft 6in" },
                ],
            },
            {
                id: "5",
                status: "Shipped",
                date: "2024-11-15",
                items: [
                    { productId: 1, quantity: 1 }, // Reference the product by its id
                    { productId: 2, quantity: 1 },
                ],
            }
        ],
    },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          password: "123456@Ab",
          address1: "mumbai",
          zipCode: "400001",
          phone: "9922334455",
          countryCode: "+91",
          billingName: "Sita",
          billingCardNumber: "1234567890123456",
          billingExpiration: "05/24",
          billingCVC: "321",
          universityName: "mit",
          billingAddress: "mumbai",
          cart:[
            {
                id: "1",
                date: "2024-16-15",
                items:[
                    {productId: 4,price: 15,quantity: 3,selectedSize: "One Size"}

                ]
            }
        ],
          orders: [
            {
              "id": "1",
              "status": "Pending",
              "date": "2024-11-17",
              "items": [
                { "productId": 2, quantity: 1, selectedSize: "5ft 6in" },
                { productId: 1, quantity: 1 ,selectedSize: "5ft 6in" }, // Reference the product by its id

              ]
            },
            {
                id: "2",
                status: "Shipped",
                date: "2024-11-15",
                items: [
                    { productId: 1, quantity: 1,selectedSize: "5ft 6in" }, // Reference the product by its id
                    { productId: 2, quantity: 1,selectedSize: "5ft 6in" },
                ],
            }
          ]
        }
];

export default users;
