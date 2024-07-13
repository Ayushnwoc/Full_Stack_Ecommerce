import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";

type DataType = {
	_id: string;
	amount: number;
	quantity: number;
	discount: string;
	status: ReactElement;
	action: ReactElement;
};

const column: Column<DataType>[] = [
	{
		Header: "ID",
		accessor: "_id",
	},
	{
		Header: "Amount",
		accessor: "amount",
	},
	{
		Header: "Quantity",
		accessor: "quantity",
	},
	{
		Header: "Discount",
		accessor: "discount",
	},
	{
		Header: "Status",
		accessor: "status",
	},
	{
		Header: "Action",
		accessor: "action",
	},
];

const Orders = () => {
    const [rows] = useState<DataType[]>([
        {
            _id: "1",
            amount: 100,
            quantity: 1,
            discount: "10",
            status: <span className="status">Delivered</span>,
            action: <button>View</button>,
        },
        {
            _id: "2",
            amount: 200,
            quantity: 2,
            discount: "20",
            status: <span className="status">Pending</span>,
            action: <button>View</button>,
        },
        {
            _id: "3",
            amount: 300,
            quantity: 3,
            discount: "30",
            status: <span className="status">Cancelled</span>,
            action: <button>View</button>,
        },
    ]);
	const table = TableHOC<DataType>(
		column,
		rows,
		"dashboard-product-box",
		"",
		rows.length > 6
	)();
	return (
		<div className="container">
			<h1>My Orders</h1>
			{table}
		</div>
	);
};

export default Orders;
