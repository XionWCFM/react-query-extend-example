import { fromEvent, of, interval, Observable, take, delay, timeout, catchError, from, retry, switchMap} from 'rxjs'




describe("Te를 테스트합니다.", () => {
  it("Te는", () => {
    const fetchUser = (userId:number) => {
      return from((async () => {
        if(Math.random() > 0.5) {
          throw new Error('hei')
        }
        return {
          id:'123',
          userId: userId,
          name:"안녕하새요"
        }
      })())
    }

    fetchUser(1).pipe(
      retry(2) ,
      catchError(err => {
        console.log('zz error네용',err)
        return of(null)
      }),
      switchMap(user => {
        return of(user)
      })
    ).subscribe({
      next(post){
        console.log(post)
      },
      complete(){
        console.log('done')
      }
    })
  });
});