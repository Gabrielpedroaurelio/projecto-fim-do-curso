import { FaMagnifyingGlass } from 'react-icons/fa6'
import style from './SearchBar.module.css'
export default function SearchBar() {
    return (
        <>
            <div className={style.SearchBar}>
                <FaMagnifyingGlass />
                <input type="text" placeholder='Pesquise..' />
            </div>
        </>
    )
}