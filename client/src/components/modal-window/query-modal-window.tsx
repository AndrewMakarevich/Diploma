import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Context } from '../..';
import modalStyles from './modal-window.module.css';
const QueryModalWindow = ({ children }: { children: JSX.Element }) => {
    const { modalStore } = useContext(Context);
    const [searchParams, setSearchParams] = useSearchParams();
    function closeModal() {
        modalStore.modalSearchParams.forEach(searchParam => {
            searchParams.delete(searchParam);
        });
        setSearchParams(searchParams);
    }
    return (
        <div className={modalStyles['modal-wrapper']} onClick={(e) => {
            closeModal();
        }}>
            <div className={modalStyles['modal-window']} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => closeModal()}>&#215;</button>
                {/* <button onClick={()=> window.history.go('?foo=faf')}/> */}
                MODAL
                <section>
                    {children}
                </section>
            </div>
        </div>
    )
};
export default observer(QueryModalWindow);