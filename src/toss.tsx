import { overlay } from "overlay-kit"

async function 결제하기(){


}

async function 인증시작하기(){}

async function 인증이완료될때까지기다려() {
    const result=  await new Promise(resolve => {
        overlay.open(() => (
            <div>
                <button onClick={() => resolve(true)}>어케어케 인증을 했습니다~</button>
            </div>
        ))
    })
    if(result) {
        결제하기()
    }
}