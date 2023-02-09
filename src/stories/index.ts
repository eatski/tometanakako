export type Story = {
    coreDescription: string;
    additinalDescription?: string;
    
}

export const story01: Story = {
    coreDescription: `
    ホゲホゲ町はクリスマスの夜景で有名である。
    その夜景はサラリーマンたちの残業によるビルの明かりでできている。
    町は観光施策として夜のビル街を明るくするためにクリスマスの夜にサラリーマンに残業してもらうように企業に要請した。
`,
    additinalDescription:`
    町は観光施策としてクリスマスの夜のサラリーマンの残業代の何割かを負担することにした。
    そうすることで企業が残業をサラリーマンに要請しやすくすることができた。
    `
}