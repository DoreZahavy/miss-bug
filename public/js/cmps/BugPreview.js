import { userService } from '../services/user.service.js'


export default {
  props: ['bug'],
  template: `
        <li class="bug-preview">
          <span>🐛</span>
          <h4>{{bug.title}}</h4>
          <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
          <h4>
              Owner: 
              <!-- <span>{{bug.owner.fullname}}</span> -->
              <RouterLink :to="'/user/' + bug.owner._id">
                  {{bug.owner.fullname}}
              </RouterLink>
          </h4>
          <div class="actions">
            <RouterLink :to="'/bug/' + bug._id">Details</RouterLink>
            <RouterLink v-if="isOwner(bug)" :to="'/bug/edit/' + bug._id"> Edit</RouterLink>
          </div>
          <button v-if="isOwner(bug)" @click="onRemove(bug._id)">X</button>
        </li>
`,
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
    isOwner(bug) {
      const user = userService.getLoggedinUser()
      if (!user) return false
      if (user.isAdmin) return true
      return bug.owner._id === user._id
    }
  },
}
