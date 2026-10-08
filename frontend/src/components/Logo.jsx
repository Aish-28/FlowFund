import { FiActivity } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Logo({ dark = false }) {
    return (
        <Link
            to="/"
            className={`brand ${dark ? "brand-dark" : ""}`}
        >
            <span className="brand-mark">
                <FiActivity />
            </span>

            <span>FlowFund</span>
        </Link>
    );
}