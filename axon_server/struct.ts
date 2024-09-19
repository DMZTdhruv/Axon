type LinkStruct = {
    _id: string,
    title: string,
    icon: string,
    cover: string,
    updatedAt: string,
}


type Dashboard = {
    _id: string,
    title: string,
    icon:  string,
    cover: string,
    createdAt: Date,
    updatedAt: Date,
    content: {
        main: [
            LinkStruct,
            LinkStruct,
            LinkStruct,
        ],
        everything: [
            LinkStruct,
            LinkStruct,
            LinkStruct,
        ],
    }
}