import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Context } from '../..';
import modalStyles from './modal-window.module.css';
const QueryModalWindow = ({ stylesById, children }: { stylesById: string, children: JSX.Element }) => {
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
            <div id={stylesById} className={`${modalStyles['modal-window']}`} onClick={(e) => e.stopPropagation()}>
                <button className={modalStyles['close-modal__btn']} onClick={() => closeModal()}>&#215;</button>
                <section className={modalStyles['modal-window__content']}>
                    {children}
                </section>
            </div>
        </div>
    )
};
export default observer(QueryModalWindow);