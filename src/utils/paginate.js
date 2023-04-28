



export function paginate(page, size) {


    if (!page || page <= 0) {
        page = 1
    }

    if (!size || size <= 0) {
        size = 2
    }
    page = parseInt(page)
    size = parseInt(size)

    const skip = (page - 1) * size
    return { skip, limit: size }
}