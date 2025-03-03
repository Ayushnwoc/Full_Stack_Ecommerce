import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { server } from "../../redux/store";
import { Product } from "../../types/types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import Loader from "../../components/loader";

interface DataType {
	photo: ReactElement;
	name: string;
	price: number;
	stock: number;
	action: ReactElement;
}

const columns: Column<DataType>[] = [
	{
		Header: "Photo",
		accessor: "photo",
	},
	{
		Header: "Name",
		accessor: "name",
	},
	{
		Header: "Price",
		accessor: "price",
	},
	{
		Header: "Stock",
		accessor: "stock",
	},
	{
		Header: "Action",
		accessor: "action",
	},
];

const img =
	"https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

const img2 = "https://m.media-amazon.com/images/I/514T0SvwkHL._SL1500_.jpg";


const Products = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReducerInitialState }) => state.userReducer
	);

	const { data, isLoading, isError, error } = useAllProductsQuery(user?._id);
	const [rows, setRows] = useState<DataType[]>([]);

	if (isError) {
		toast.error(error.data.message);
	}

	useEffect(() => {
		if (data) {
			setRows(
				data?.products.map((i:any) => ({
					photo: <img src={`${server}/${i.photo}`} />,
					name: i.name,
					price: i.price,
					stock: i.stock,
					action: (
						<Link to={`/admin/product/?id=${i._id}`}>Manage</Link>
					),
				}))
			);
		}
	}, [data]);

	const Table = TableHOC<DataType>(
		columns,
		rows,
		"dashboard-product-box",
		"Products"
		// rows.length > 6
	)();

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main>
				{isLoading ? <Loader /> : Table}
			</main>
			<Link to="/admin/product/new" className="create-product-btn">
				<FaPlus />
			</Link>
		</div>
	);
};

export default Products;
