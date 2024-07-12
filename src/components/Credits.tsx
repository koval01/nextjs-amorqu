import { Icon32LogoVk } from "@vkontakte/icons";
import { DisplayTitle, Flex, Footer, Footnote, Link } from "@vkontakte/vkui";

const Logo = () => (
    <div className="inline-flex align-middle pl-2">
        <Icon32LogoVk className="relative inline-block align-middle bottom-0.5" />
        <DisplayTitle level="2">
            ui
        </DisplayTitle>
    </div>
)

const Credits = () => (
    <Footer className="fixed bottom-0 w-full pb-2">
        <Flex direction="column" gap="xl" margin="auto">
            <Footnote>
                Developed by 
                <Link target="_blank" href="https://github.com/Laefye">Laefye</Link> 
                and 
                <Link target="_blank" href="https://github.com/koval01">Koval</Link>
            </Footnote>
            <Footnote weight="1">
                With 
                <Logo />
            </Footnote>
        </Flex>
    </Footer>
)

export default Credits;
