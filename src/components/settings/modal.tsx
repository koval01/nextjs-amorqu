import { ModalDismissButton, PopoutWrapper, useAdaptivityConditionalRender } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

const Modal = ({ onClose }: { onClose: (e: any) => void }) => {
    const { t } = useTranslation();
    const { sizeX } = useAdaptivityConditionalRender();

    return (
        <PopoutWrapper onClick={onClose}>
            <div
                style={{
                    backgroundColor: 'var(--vkui--color_background_content)',
                    borderRadius: 8,
                    position: 'relative',
                    padding: '12px',
                }}
            >
                <h4>Кастомное модальное окно</h4>

                {sizeX.regular && (
                    <ModalDismissButton className={sizeX.regular.className} onClick={onClose}>
                        {t("Close")}
                    </ModalDismissButton>
                )}
            </div>
        </PopoutWrapper>
    );
}

export default Modal;
