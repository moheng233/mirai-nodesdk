export function commandGroud<T extends new(...args: any[]) => {}>(target: T) {
    return class extends target {
        type:String = "groud"
    }
}