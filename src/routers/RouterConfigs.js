const RouterConfigs = {
    "controller": {},
    "host": {
        collections: {
            "controllers": {
                foreignType: "controller",
                localKey: "id",
                fkey: "hostId",
                readOnly: true  // TODO: Implement posting to parent for ManyToMany relationships
            }
        }
    },
    "pending-action": {
        "removedEndpoints": [ "PATCH", "PUT" ]
    }
}

export default RouterConfigs;